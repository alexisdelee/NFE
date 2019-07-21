package com.example.NFEspring.repository;

import com.example.NFEspring.entity.Permission;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@org.springframework.stereotype.Repository
public interface IPermissionRepository extends Repository<Permission, Integer> {

    @Transactional(readOnly = true)
    @Query("select permission from Permission permission where permission.role.id = :roleId")
    Collection<Permission> findByRole(@Param("roleId") Integer roleId);

}
